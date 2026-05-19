import Navbar from "@/components/navbar";

export default function UserLayout({children}: Readonly<{children: React.ReactNode}>){
    return(
        <main className="grow pt-20">
        <Navbar />
        {children}
        </main>
    )
}