import Issue from "@/components/Issue";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";


export default function Home() {
    const post  = {
        createdBy: 'raz',
        message: 'hello',
        timestamp: new Date(),
        imageUrl: '',
        userAvatar: ''
    }

    return (
        <>
            <Navbar></Navbar>
            <Issue {...post}></Issue>
        </>
    )
}


