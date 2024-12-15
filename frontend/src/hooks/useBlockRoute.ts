import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { type Address } from 'viem'
import { BLOCKROUTE_ADDRESS } from '../config/wagmi'

// Contract ABI types
export enum ShipmentStatus {
  Created,
  QualityChecked,
  InTransit,
  Delayed,
  Disputed,
  ResolvingDispute,
  Delivered,
  Rejected,
  Cancelled
}

export enum Role {
  None,
  Manufacturer,
  Supplier,
  Distributor,
  QualityInspector,
  Carrier,
  Receiver
}

export type Location = {
  latitude: string
  longitude: string
  name: string
  timestamp: bigint
  updatedBy: Address
}

export type Shipment = {
  id: bigint
  productName: string
  description: string
  manufacturer: Address
  supplier: Address
  carrier: Address
  receiver: Address
  origin: Location
  destination: Location
  estimatedDeliveryDate: bigint
  status: ShipmentStatus
}

export type CreateShipmentArgs = {
  productName: string
  description: string
  supplier: Address
  carrier: Address
  receiver: Address
  origin: Location
  destination: Location
  estimatedDeliveryDate: bigint
  isTemperatureSensitive: boolean
  isHumiditySensitive: boolean
  documentsHash: `0x${string}`
}

// Contract ABI
export const blockRouteAbi = {
  getShipment: {
    inputs: [{ name: "shipmentId", type: "uint256" }],
    name: "getShipment",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "productName", type: "string" },
      { name: "description", type: "string" },
      { name: "manufacturer", type: "address" },
      { name: "supplier", type: "address" },
      { name: "carrier", type: "address" },
      { name: "receiver", type: "address" },
      {
        name: "origin",
        type: "tuple",
        components: [
          { name: "latitude", type: "string" },
          { name: "longitude", type: "string" },
          { name: "name", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "updatedBy", type: "address" }
        ]
      },
      {
        name: "destination",
        type: "tuple",
        components: [
          { name: "latitude", type: "string" },
          { name: "longitude", type: "string" },
          { name: "name", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "updatedBy", type: "address" }
        ]
      },
      { name: "estimatedDeliveryDate", type: "uint256" },
      { name: "status", type: "uint8" }
    ],
    stateMutability: "view"
  },
  getTotalShipments: {
    inputs: [],
    name: "getTotalShipments",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  createShipment: {
    inputs: [
      { name: "productName", type: "string" },
      { name: "description", type: "string" },
      { name: "supplier", type: "address" },
      { name: "carrier", type: "address" },
      { name: "receiver", type: "address" },
      {
        name: "origin",
        type: "tuple",
        components: [
          { name: "latitude", type: "string" },
          { name: "longitude", type: "string" },
          { name: "name", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "updatedBy", type: "address" }
        ]
      },
      {
        name: "destination",
        type: "tuple",
        components: [
          { name: "latitude", type: "string" },
          { name: "longitude", type: "string" },
          { name: "name", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "updatedBy", type: "address" }
        ]
      },
      { name: "estimatedDeliveryDate", type: "uint256" },
      { name: "isTemperatureSensitive", type: "bool" },
      { name: "isHumiditySensitive", type: "bool" },
      { name: "documentsHash", type: "bytes32" }
    ],
    name: "createShipment",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable"
  }
} as const

export function useBlockRoute() {
  const { address } = useAccount()

  // Read total shipments
  const { data: totalShipments } = useContractRead({
    address: BLOCKROUTE_ADDRESS,
    abi: [blockRouteAbi.getTotalShipments],
    functionName: 'getTotalShipments',
  })

  // Read shipment details
  const useShipment = (shipmentId: bigint) => {
    return useContractRead({
      address: BLOCKROUTE_ADDRESS,
      abi: [blockRouteAbi.getShipment],
      functionName: 'getShipment',
      args: [shipmentId],
    })
  }

  // Create shipment
  const useCreateShipment = () => {
    return useContractWrite({
      address: BLOCKROUTE_ADDRESS,
      abi: [blockRouteAbi.createShipment],
      functionName: 'createShipment',
    })
  }

  return {
    address,
    totalShipments,
    useShipment,
    useCreateShipment,
  }
}
