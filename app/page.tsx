'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Github } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalculateurAchatProPersoAmeliore } from "@/components/calculateur-achat-pro-perso-ameliore"
import { ComprehensiveIncomeTaxCalculatorComponent } from "@/components/components-comprehensive-income-tax-calculator"

export default function Home() {
    const [activeTab, setActiveTab] = useState("societe-perso")

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Calculateurs Fiscaux
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Optimisez vos décisions financières avec nos calculateurs
                    </p>
                    <div className="mt-5 flex justify-center">
                        <Button
                            asChild
                        >
                            <a
                                href="https://github.com/hndgy/tax-saver"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2"
                            >
                                <Github className="mr-2 h-4 w-4" />
                                Voir le code
                            </a>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="societe-perso">Société vs Perso</TabsTrigger>
                        <TabsTrigger value="impot-revenu">Impôt sur le Revenu</TabsTrigger>
                    </TabsList>
                    <TabsContent value="societe-perso">
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Calculateur Achat Pro vs Perso
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Comparez le coût d'un achat personnel à celui d'un achat professionnel
                            </p>
                            <CalculateurAchatProPersoAmeliore />
                        </div>
                    </TabsContent>
                    <TabsContent value="impot-revenu">
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Calculateur d'Impôt sur le Revenu
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Estimez votre impôt sur le revenu en fonction de votre situation
                            </p>
                            <ComprehensiveIncomeTaxCalculatorComponent />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}