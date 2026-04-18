"use server";

import {supabaseAdminClient} from "@/lib/supabase-server";

export interface Package {
  id: number,
  item_id: string,
  name: string,
  description: string,
  price: number,
}

export async function fetchPackagePriceById(id: string): Promise<{
  error: false,
  price: number
} | {
  error: true
}> {
  try {
    const adminClient = supabaseAdminClient()
    const {data, error: packagePriceError} = await adminClient
      .from('packages')
      .select("price")
      .eq("item_id", id)
      .single()

    if(packagePriceError !== null) {
      throw packagePriceError
    }

    const packagePrice = Number(data.price)
    if(!Number.isInteger(packagePrice))
      throw "Price is not an integer"

    return {
      error: false,
      price: packagePrice
    }

  } catch (error) {
    console.error("Error fetching price:", error)

    return {
      error: true
    }
  }
}

export default async function fetchPackages(): Promise<{
  error: false,
  packages: Package[]
} | {
  error: true
}> {
  try {

    const adminClient = supabaseAdminClient()

    const {data, error: pricingsError} = await adminClient.from('packages')
      .select('*')

    if(pricingsError !== null) {
      throw pricingsError
    }

    return {
      error: false,
      packages: data as Package[]
    }
  } catch (error) {
    console.error("Error fetching price:", error)

    return {
      error: true
    }
  }
}