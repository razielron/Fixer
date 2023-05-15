import IssueModal from "@/components/IssueModal";
import Issues from "@/components/Issues";
import Navbar from "@/components/Navbar";


export default function Home() {
    return (
        <>
            <Navbar></Navbar>
            <IssueModal></IssueModal>
            <Issues></Issues>
        </>
    )
}


