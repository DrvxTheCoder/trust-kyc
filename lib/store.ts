import { create } from "zustand"
import { Customer, customers as initialCustomers } from "./data"

interface CustomerStore {
  customers: Customer[]
  moveCustomer: (customerId: string, stageId: string) => void
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: initialCustomers,
  moveCustomer: (customerId, stageId) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, stage: stageId, daysInStage: 0, stuck: false } : c
      ),
    })),
}))
