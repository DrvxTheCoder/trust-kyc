"use client"

import { useParams } from "next/navigation"
import { useCustomerStore } from "@/lib/store"
import { CustomerProfile } from "@/components/kyc/customer-profile"

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const customer = useCustomerStore((s) => s.customers.find((c) => c.id === id))

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="text-sm text-muted-foreground">Customer not found.</div>
      </div>
    )
  }

  return <CustomerProfile customer={customer} />
}
