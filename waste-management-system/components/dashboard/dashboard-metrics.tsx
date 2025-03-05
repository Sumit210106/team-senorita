"use client"

import React, { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, DollarSign, Package, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export function DashboardMetrics() {
  const [totalWasteKg, setTotalWasteKg] = useState<number | null>(null);
  const [totalLiquidLiters, setTotalLiquidLiters] = useState<number | null>(null);
  const [totalElectronicsUnits, setTotalElectronicsUnits] = useState<number | null>(null);
  const [revenueLoss, setRevenueLoss] = useState<number | null>(null);
  const [expiringSoon, setExpiringSoon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalWaste() {
      const { data, error } = await supabase
        .from("waste_entries")
        .select("category, quantity");

      if (error) {
        console.error("Error fetching total waste data:", error);
        setLoading(false);
        return;
      }

      const totalKg = data ? data
        .filter((item: any) => ["dry", "wet", "non-edible"].includes(item.category))
        .reduce((sum: number, item: any) => sum + Number(item.quantity), 0) : 0;

      const totalLiters = data ? data
        .filter((item: any) => item.category === "liquid")
        .reduce((sum: number, item: any) => sum + Number(item.quantity), 0) : 0;

      const totalUnits = data ? data
        .filter((item: any) => item.category === "electronics")
        .reduce((sum: number, item: any) => sum + Number(item.quantity), 0) : 0;

      setTotalWasteKg(Number(totalKg.toFixed(2)));
      setTotalLiquidLiters(Number(totalLiters.toFixed(2)));
      setTotalElectronicsUnits(Math.floor(totalUnits));
    }

    async function fetchRevenueLoss() {
      const { data, error } = await supabase
        .from("waste_entries")
        .select("cost");

      if (error) {
        console.error("Error fetching revenue loss data:", error);
        setLoading(false);
        return;
      }

      const total = data ? data.reduce((sum: number, item: any) => sum + Number(item.cost), 0) : 0;
      setRevenueLoss(Number(total.toFixed(2)));
    }

    async function fetchExpiringSoon() {
      const { data, error } = await supabase
        .from("inventory")
        .select("expiry_date");

      if (error) {
        console.error("Error fetching expiring soon data:", error);
        setLoading(false);
        return;
      }

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const expiringSoonCount = data ? data
        .filter((item: any) => {
          const expiryDate = new Date(item.expiry_date);
          return expiryDate >= today && expiryDate <= nextWeek;
        }).length : 0;

      setExpiringSoon(expiringSoonCount);
    }

    async function fetchData() {
      await fetchTotalWaste();
      await fetchRevenueLoss();
      await fetchExpiringSoon();
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xxl font-bold">
            ⚖ {(totalWasteKg ?? 0).toFixed(2)} kg
          </div>
          <div className="text-xxl font-bold">
            💧 {(totalLiquidLiters ?? 0).toFixed(2)} liters
          </div>
          <div className="text-xxl font-bold">
            📦 {(totalElectronicsUnits ?? 0).toFixed()} pcs
          </div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowUp className="mr-1 h-3 w-3 text-destructive" />
            <span className="text-destructive">12%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Loss</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹ {revenueLoss}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowDown className="mr-1 h-3 w-3 text-primary" />
            <span className="text-primary">8%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiringSoon} items</div>
          <p className="text-xs text-muted-foreground">Within the next 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}

