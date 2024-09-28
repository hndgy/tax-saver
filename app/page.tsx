import Image from "next/image";
import {CalculateurAchatProPersoAmeliore} from "@/components/calculateur-achat-pro-perso-ameliore";

export default function Home() {
  return (
    <div className={"flex flex-col mt-16"}>
      <CalculateurAchatProPersoAmeliore/>
    </div>
  );
}
