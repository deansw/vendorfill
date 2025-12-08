// app/upload/page.tsx — FIXED PROFESSIONAL VERSION
"use client"
import { useState } from "react"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const getPrice = (size: number) => size > 5000000 ? 199 : size > 200000
