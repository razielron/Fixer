import IssueModal from "@/components/IssueModal";
import Issues from "@/components/Issues";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";


export default function Home() {
    return (
        <>
            <Navbar></Navbar>
            <Issues></Issues>
            <IssueModal></IssueModal>
        </>
    )
}


