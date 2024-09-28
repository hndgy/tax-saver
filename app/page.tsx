import { Button } from "@/components/ui/button"
import { Github } from 'lucide-react'
import {CalculateurAchatProPersoAmeliore} from "@/components/calculateur-achat-pro-perso-ameliore";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Calculateur Achat Pro vs Perso
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Comparez le coût d'un achat personnel à celui d'un achat professionnel
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
                                Voir sur le code
                            </a>
                        </Button>
                    </div>
                </div>
                <CalculateurAchatProPersoAmeliore />
            </div>
        </main>
    )
}