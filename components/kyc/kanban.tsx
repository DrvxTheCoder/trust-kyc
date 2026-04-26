"use client"

import React, { useCallback, useId, useMemo, useRef, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Customer, WorkflowStage } from "@/lib/data"
import { RiskBadge, TypeBadge } from "@/components/ui/tk-badge"

// ---- Column header colours ----
const COL_COLORS = [
  "#64748B", "#3B82F6", "#8B5CF6", "#F59E0B",
  "#2563EB", "#10B981", "#0ea5e9", "#ec4899",
]

// ---- Kanban Item ----
function KanbanCard({
  customer,
  onOpen,
  isDragging,
}: {
  customer: Customer
  onOpen: (c: Customer) => void
  isDragging?: boolean
}) {
  const pct = (customer.docs / customer.docsTotal) * 100
  const barColor = pct === 100 ? "#10B981" : pct < 40 ? "#EF4444" : "#F59E0B"

  return (
    <div
      onClick={() => onOpen(customer)}
      className={cn(
        "rounded-xl border bg-card p-3 cursor-pointer select-none",
        "hover:border-primary/40 hover:shadow-sm transition-all",
        customer.stuck && "border-destructive/40",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{customer.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {customer.id} · {customer.company ?? "Individual"}
          </div>
        </div>
        <RiskBadge risk={customer.risk} />
      </div>
      <TypeBadge type={customer.type} />
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">
            {customer.docs}/{customer.docsTotal} docs
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>
        <span className={cn("text-xs font-mono shrink-0", customer.stuck ? "text-destructive" : "text-muted-foreground")}>
          {customer.stuck && "⚠ "}{customer.daysInStage}d
        </span>
      </div>
    </div>
  )
}

function SortableKanbanCard({
  customer,
  onOpen,
}: {
  customer: Customer
  onOpen: (c: Customer) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard customer={customer} onOpen={onOpen} isDragging={isDragging} />
    </div>
  )
}

// ---- Column ----
function KanbanColumn({
  stage,
  customers,
  colorIndex,
  onOpen,
}: {
  stage: WorkflowStage
  customers: Customer[]
  colorIndex: number
  onOpen: (c: Customer) => void
}) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
    data: { type: "column" },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 min-w-[220px] w-[220px] shrink-0",
        isOver && "ring-2 ring-primary/30 rounded-xl"
      )}
    >
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full shrink-0"
            style={{ background: COL_COLORS[colorIndex % COL_COLORS.length] }}
          />
          <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
            {stage.name}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {customers.length}
        </span>
      </div>

      <SortableContext items={customers.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[60px]">
          {customers.map((c) => (
            <SortableKanbanCard key={c.id} customer={c} onOpen={onOpen} />
          ))}
          {customers.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
              Empty
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

// ---- Main Kanban ----
interface KanbanBoardProps {
  customers: Customer[]
  stages: WorkflowStage[]
  onOpen: (c: Customer) => void
  onMove: (customerId: string, stageId: string) => void
}

export function KanbanBoard({ customers, stages, onOpen, onMove }: KanbanBoardProps) {
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const found = customers.find((c) => c.id === event.active.id)
    if (found) setActiveCustomer(found)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCustomer(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Check if dropped on a column
    const overStage = stages.find((s) => s.id === over.id)
    if (overStage) {
      onMove(active.id as string, overStage.id)
      return
    }

    // Dropped on a card — find which column that card is in
    const overCustomer = customers.find((c) => c.id === over.id)
    if (overCustomer) {
      onMove(active.id as string, overCustomer.stage)
    }
  }

  const columnCustomers = useMemo(() => {
    const map: Record<string, Customer[]> = {}
    for (const s of stages) map[s.id] = []
    for (const c of customers) {
      if (map[c.stage]) map[c.stage].push(c)
    }
    return map
  }, [customers, stages])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {stages.map((stage, i) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              customers={columnCustomers[stage.id] ?? []}
              colorIndex={i}
              onOpen={onOpen}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeCustomer && (
          <div className="rotate-2 shadow-lg opacity-95">
            <KanbanCard customer={activeCustomer} onOpen={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
