'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Tax brackets for 2023 income (declared in 2024)
const taxBrackets = [
  { limit: 11294, rate: 0 },
  { limit: 28797, rate: 11 },
  { limit: 82341, rate: 30 },
  { limit: 177106, rate: 41 },
  { limit: Infinity, rate: 45 }
]

// High income contribution brackets
const highIncomeContributionBrackets = [
  { limitSingle: 250000, limitCouple: 500000, rateSingle: 0, rateCouple: 0 },
  { limitSingle: 500000, limitCouple: 1000000, rateSingle: 3, rateCouple: 3 },
  { limitSingle: Infinity, limitCouple: Infinity, rateSingle: 4, rateCouple: 4 }
]

function calculateIncomeTax(income: number, parts: number) {
  const incomePerPart = income / parts
  let totalTax = 0

  for (let i = 0; i < taxBrackets.length; i++) {
    const bracket = taxBrackets[i]
    const prevLimit = i > 0 ? taxBrackets[i-1].limit : 0
    const taxableInThisBracket = Math.max(0, Math.min(incomePerPart, bracket.limit) - prevLimit)
    totalTax += taxableInThisBracket * (bracket.rate / 100)
  }

  return totalTax * parts
}

function calculateDecote(tax: number, isCouple: boolean) {
  const threshold = isCouple ? 3191 : 1929
  const forfait = isCouple ? 1444 : 873
  if (tax <= threshold) {
    return Math.max(0, forfait - (tax * 0.4525))
  }
  return 0
}

function calculateHighIncomeContribution(income: number, isCouple: boolean) {
  let contribution = 0
  const brackets = highIncomeContributionBrackets

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i]
    const prevLimit = i > 0 ? (isCouple ? brackets[i-1].limitCouple : brackets[i-1].limitSingle) : 0
    const taxableInThisBracket = Math.max(0, income - prevLimit)
    const limit = isCouple ? bracket.limitCouple : bracket.limitSingle
    const rate = isCouple ? bracket.rateCouple : bracket.rateSingle
    
    if (income > prevLimit) {
      contribution += Math.min(taxableInThisBracket, limit - prevLimit) * (rate / 100)
    }
  }

  return contribution
}

export function ComprehensiveIncomeTaxCalculatorComponent() {
  const [income, setIncome] = useState(50000)
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'couple'>('single')
  const [children, setChildren] = useState(0)
  const [isHandicapped, setIsHandicapped] = useState(false)
  const [isVeteran, setIsVeteran] = useState(false)
  const [result, setResult] = useState<{
    grossTax: number
    netTax: number
    effectiveRate: number
    marginalRate: number
    decote: number
    highIncomeContribution: number
  } | null>(null)

  const calculateTax = () => {
    let parts = maritalStatus === 'single' ? 1 : 2
    parts += children * 0.5
    if (isHandicapped || isVeteran) parts += 0.5

    const grossTax = calculateIncomeTax(income, parts)
    const decote = calculateDecote(grossTax, maritalStatus === 'couple')
    const highIncomeContribution = calculateHighIncomeContribution(income, maritalStatus === 'couple')
    const netTax = Math.max(0, grossTax - decote) + highIncomeContribution

    const effectiveRate = (netTax / income) * 100
    const marginalRate = taxBrackets.find(bracket => income / parts <= bracket.limit)?.rate || 45

    setResult({
      grossTax,
      netTax,
      effectiveRate,
      marginalRate,
      decote,
      highIncomeContribution
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Calculateur Complet d'Impôt sur le Revenu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); calculateTax(); }} className="space-y-4">
          <div>
            <Label htmlFor="income">Revenu net imposable (€)</Label>
            <Input 
              id="income" 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maritalStatus">Situation familiale</Label>
            <Select onValueChange={(value: 'single' | 'couple') => setMaritalStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez votre situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Célibataire, divorcé(e), veuf(ve)</SelectItem>
                <SelectItem value="couple">Marié(e) ou pacsé(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="children">Nombre d'enfants à charge</Label>
            <Input 
              id="children" 
              type="number" 
              value={children} 
              onChange={(e) => setChildren(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isHandicapped" 
              checked={isHandicapped} 
              onCheckedChange={(checked) => setIsHandicapped(checked as boolean)}
            />
            <Label htmlFor="isHandicapped">Titulaire d'une carte d'invalidité</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isVeteran" 
              checked={isVeteran} 
              onCheckedChange={(checked) => setIsVeteran(checked as boolean)}
            />
            <Label htmlFor="isVeteran">Ancien combattant</Label>
          </div>
          <Button type="submit">Calculer l'impôt</Button>
        </form>
        {result && (
          <Alert className="mt-4">
            <AlertTitle>Résultat du calcul</AlertTitle>
            <AlertDescription>
              <p>Impôt brut : {result.grossTax.toFixed(2)} €</p>
              <p>Décote : {result.decote.toFixed(2)} €</p>
              <p>Contribution exceptionnelle sur les hauts revenus : {result.highIncomeContribution.toFixed(2)} €</p>
              <p>Impôt net à payer : {result.netTax.toFixed(2)} €</p>
              <p>Taux d'imposition effectif : {result.effectiveRate.toFixed(2)}%</p>
              <p>Taux marginal d'imposition : {result.marginalRate}%</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Barème de l'impôt sur le revenu 2024 (revenus 2023)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fraction du revenu imposable (pour une part)</TableHead>
                <TableHead>Taux d'imposition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxBrackets.map((bracket, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === 0
                      ? `Jusqu'à ${bracket.limit.toLocaleString()} €`
                      : index === taxBrackets.length - 1
                      ? `Supérieur à ${taxBrackets[index-1].limit.toLocaleString()} €`
                      : `De ${(taxBrackets[index-1].limit + 1).toLocaleString()} € à ${bracket.limit.toLocaleString()} €`}
                  </TableCell>
                  <TableCell>{bracket.rate} %</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}