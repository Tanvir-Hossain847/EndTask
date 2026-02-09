import Core from "@/components/Core";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" dark:bg-black">
      <main>
        <Navbar></Navbar>
        <Core></Core>
      </main>
    </div>
  );
}
