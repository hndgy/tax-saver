'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

type RemunerationType = 'salary' | 'dividends' | 'bnc'

type Product = {
  name: string
  price: number
  vatRate: number
}

const products: Product[] = [
  { name: "iPhone", price: 1000, vatRate: 20 },
  { name: "Mac", price: 2000, vatRate: 20 },
  { name: "Voiture", price: 20000, vatRate: 20 },
  { name: "Restaurant", price: 20, vatRate: 10 },
  { name: "Autre", price: 0, vatRate: 20 },
]

// Tranches d'imposition 2023 (à mettre à jour chaque année)
const taxBrackets = [
  { limit: 10777, rate: 0 },
  { limit: 27478, rate: 11 },
  { limit: 78570, rate: 30 },
  { limit: 168994, rate: 41 },
  { limit: Infinity, rate: 45 }
]

function calculateTaxAndRate(income: number) {
  let remainingIncome = income
  let totalTax = 0
  let lastRate = 0

  for (const bracket of taxBrackets) {
    if (remainingIncome > 0) {
      const taxableInThisBracket = Math.min(remainingIncome, bracket.limit - (bracket.limit === Infinity ? 168994 : taxBrackets[taxBrackets.indexOf(bracket) - 1]?.limit || 0))
      totalTax += taxableInThisBracket * (bracket.rate / 100)
      remainingIncome -= taxableInThisBracket
      lastRate = bracket.rate
    } else {
      break
    }
  }

  const effectiveRate = (totalTax / income) * 100
  return { totalTax, marginalRate: lastRate, effectiveRate }
}

export function CalculateurAchatProPersoAmeliore() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0])
  const [priceTTC, setPriceTTC] = useState(products[0].price)
  const [vatRate, setVatRate] = useState(products[0].vatRate)
  const [declaredIncome, setDeclaredIncome] = useState(70000)
  const [marginalTaxRate, setMarginalTaxRate] = useState(30)
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0)
  const [socialContributionsRate, setSocialContributionsRate] = useState(45)
  const [remunerationType, setRemunerationType] = useState<RemunerationType>('bnc')
  const [canRecoverVAT, setCanRecoverVAT] = useState(true)
  const [result, setResult] = useState<{
    personal: number,
    company: number,
    gain: number,
    detailedCalculations: string,
    explanation: string
  } | null>(null)

  useEffect(() => {
    const { marginalRate, effectiveRate } = calculateTaxAndRate(declaredIncome)
    setMarginalTaxRate(marginalRate)
    setEffectiveTaxRate(effectiveRate)
  }, [declaredIncome])

  const handleProductChange = (productName: string) => {
    const newProduct = products.find(p => p.name === productName) || products[0]
    setSelectedProduct(newProduct)
    if (newProduct.name !== "Autre") {
      setPriceTTC(newProduct.price)
      setVatRate(newProduct.vatRate)
    }
  }

  const calculateGain = () => {
    const priceHT = priceTTC / (1 + vatRate / 100)
    const vat = priceTTC - priceHT

    // Calculs pour l'achat personnel
    let personalCost: number
    let personalExplanation: string
    const bncSocialRate = 22 // Taux approximatif pour les BNC

    if (remunerationType === 'bnc') {
      personalCost = priceTTC / (1 - (marginalTaxRate + bncSocialRate) / 100)
      personalExplanation = `Achat personnel (BNC) :
        - Coût TTC : ${priceTTC.toFixed(2)}€
        - Revenu nécessaire avant impôts et charges : ${personalCost.toFixed(2)}€
        - Taux marginal d'imposition : ${marginalTaxRate}%
        - Taux de charges sociales BNC : ${bncSocialRate}%
        - Coût réel : ${personalCost.toFixed(2)}€`
    } else {
      personalCost = priceTTC / (1 - marginalTaxRate / 100)
      personalExplanation = `Achat personnel :
        - Coût TTC : ${priceTTC.toFixed(2)}€
        - Revenu nécessaire avant impôts : ${personalCost.toFixed(2)}€
        - Taux marginal d'imposition : ${marginalTaxRate}%
        - Coût réel : ${personalCost.toFixed(2)}€`
    }

    // Calculs pour l'achat par la société
    let companyCost: number
    let taxSavings: number
    let companyExplanation: string

    if (canRecoverVAT) {
      companyCost = priceHT
      companyExplanation = `Achat par la société :
        - Prix HT : ${priceHT.toFixed(2)}€ (TVA récupérée : ${vat.toFixed(2)}€)`
    } else {
      companyCost = priceTTC
      companyExplanation = `Achat par la société :
        - Prix TTC : ${priceTTC.toFixed(2)}€ (TVA non récupérée)`
    }

    const effectiveRate = remunerationType === 'bnc' ? marginalTaxRate + bncSocialRate : marginalTaxRate + socialContributionsRate
    taxSavings = companyCost * (effectiveRate / 100)
    companyExplanation += `
      - Économie d'impôt et charges : ${taxSavings.toFixed(2)}€ (${effectiveRate}%)`

    companyCost -= taxSavings
    companyExplanation += `
      - Coût final pour la société : ${companyCost.toFixed(2)}€`

    const gain = personalCost - companyCost

    const detailedCalculations = `${personalExplanation}\n\n${companyExplanation}\n\nDifférence : ${Math.abs(gain).toFixed(2)}€ ${gain >= 0 ? 'en faveur de l\'achat par la société' : 'en faveur de l\'achat personnel'}`

    const explanation = `
      Ce calcul compare le coût réel d'un achat personnel au coût pour la société.
      
      Pour l'achat personnel, nous considérons :
      1. Le revenu brut nécessaire pour financer l'achat
      2. Le taux marginal d'imposition (dernier taux appliqué sur la tranche la plus élevée)
      3. Les charges sociales (pour les BNC)
      
      Pour l'achat par la société, nous prenons en compte :
      1. La récupération de TVA (si applicable)
      2. Les économies d'impôts et de charges sociales
      
      La différence représente l'avantage financier de faire passer l'achat par la société ou de le faire à titre personnel.
      
      Note : Ce calcul utilise des simplifications et ne prend pas en compte tous les aspects fiscaux. Consultez un expert-comptable pour une analyse complète.
    `

    setResult({
      personal: personalCost,
      company: companyCost,
      gain: gain,
      detailedCalculations: detailedCalculations,
      explanation: explanation
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Comparateur : Achat professionnel vs personnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product">Produit</Label>
              <Select onValueChange={handleProductChange} defaultValue={selectedProduct.name}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priceTTC">Prix TTC (€)</Label>
              <Input 
                id="priceTTC" 
                type="number" 
                value={priceTTC} 
                onChange={(e) => setPriceTTC(Number(e.target.value))} 
                disabled={selectedProduct.name !== "Autre"}
              />
            </div>
            <div>
              <Label htmlFor="vatRate">Taux de TVA (%)</Label>
              <Input 
                id="vatRate" 
                type="number" 
                value={vatRate} 
                onChange={(e) => setVatRate(Number(e.target.value))} 
              />
            </div>
            <div>
              <Label htmlFor="declaredIncome">Revenu annuel déclaré (€)</Label>
              <Input 
                id="declaredIncome" 
                type="number" 
                value={declaredIncome} 
                onChange={(e) => setDeclaredIncome(Number(e.target.value))} 
              />
            </div>
            <div>
              <Label htmlFor="marginalTaxRate">Taux marginal d'imposition (%)</Label>
              <Input 
                id="marginalTaxRate" 
                type="number" 
                value={marginalTaxRate} 
                disabled
              />
            </div>
            <div>
              <Label htmlFor="remunerationType">Type de rémunération</Label>
              <Select value={remunerationType} onValueChange={(value: RemunerationType) => setRemunerationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de rémunération" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salaire</SelectItem>
                  <SelectItem value="dividends">Dividendes</SelectItem>
                  <SelectItem value="bnc">BNC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {remunerationType !== 'bnc' && (
              <div>
                <Label htmlFor="socialContributionsRate">Taux de charges sociales (%)</Label>
                <Input 
                  id="socialContributionsRate" 
                  type="number" 
                  value={socialContributionsRate} 
                  onChange={(e) => setSocialContributionsRate(Number(e.target.value))} 
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="canRecoverVAT" 
              checked={canRecoverVAT} 
              onCheckedChange={(checked) => setCanRecoverVAT(checked as boolean)}
            />
            <Label htmlFor="canRecoverVAT">La société peut récupérer la TVA</Label>
          </div>
          <Button onClick={calculateGain}>Calculer la différence</Button>
          {result && (
            <Alert variant={result.gain >= 0 ? "default" : "destructive"}>
              <AlertTitle className="flex items-center">
                {result.gain >= 0 ? (
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                )}
                Résultat de la comparaison
              </AlertTitle>
              <AlertDescription>
                <p className="font-bold text-lg">
                  {result.gain >= 0 ? 'Gain' : 'Perte'} en passant l'achat par la société : {Math.abs(result.gain).toFixed(2)} €
                </p>
                <p>Coût en achat personnel : {result.personal.toFixed(2)} €</p>
                <p>Coût en achat par la société : {result.company.toFixed(2)} €</p>
              </AlertDescription>
            </Alert>
          )}
          {result && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger>Voir les détails des calculs</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs whitespace-pre-wrap">{result.detailedCalculations}</pre>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="explanation">
                <AccordionTrigger>En savoir plus sur les calculs</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <p className="text-sm whitespace-pre-wrap">{result.explanation}</p>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  )
}