import Item from "@/components/Item";
import Navbar from "@/components/Navbar";
import productsJson from "@/src/data/products.json";
import { useState } from "react";
import PurchaseModal from "@/components/PurchaseModal";

interface Product {
    id: number;
    title: string;
    stars: number;
    price: number;
    currency: string;
    photoUrl: string;
}

const Store: React.FC = () => {
    const [showPurchaseModal, setshowPurchaseModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const hideModal = () => {
        setshowPurchaseModal(false);
    }

    const showModal = (id: number) => {
        const product = productsJson.products.filter(x => x.id === id).at(0);
        if (!product) return;
        setSelectedProduct(product);
        setshowPurchaseModal(true);
    }

    return (
        <>
            <Navbar></Navbar>i
            {showPurchaseModal && (<PurchaseModal hideModal={hideModal} {...selectedProduct} ></PurchaseModal>)}


            <div className="flex w-4/5 mx-auto flex-wrap mt-10">
                {productsJson.products.map((currentProduct, index) => (
                    <div className="w-1/3 px-1 mt-5 flex justify-center items-center">
                        <Item key={index} onPurchase={showModal} {...currentProduct} />
                    </div>
                ))}
            </div>
            <div className="mb-10"></div>
        </>
    );
  }

  export default Store;