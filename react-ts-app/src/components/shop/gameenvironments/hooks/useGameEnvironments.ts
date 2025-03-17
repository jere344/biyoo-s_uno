import { useState, useEffect } from "react";
import ShopDS from "@DS/ShopDS";
import IGameEnvironment from "@DI/IGameEnvironment";
import IGameEnvironmentInventory from "@DI/IGameEnvironmentInventory";

const useGameEnvironments = () => {
    const [environments, setEnvironments] = useState<IGameEnvironment[]>([]);
    const [inventory, setInventory] = useState<IGameEnvironmentInventory[]>([]);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [newEnvironment, setNewEnvironment] = useState<IGameEnvironment | null>(null);
    const [newInventoryId, setNewInventoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [environmentsResponse, inventoryResponse] = await Promise.all([
                    ShopDS.getGameEnvironments(),
                    ShopDS.getGameEnvironmentInventory(),
                ]);
                setEnvironments(environmentsResponse.data);
                setInventory(inventoryResponse.data);
            } catch (error) {
                console.error("Error fetching game environments data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchInventory = async () => {
        const response = await ShopDS.getGameEnvironmentInventory();
        setInventory(response.data);
    };

    const handlePurchaseEnvironment = async (environmentId: number) => {
        try {
            const response = await ShopDS.purchaseGameEnvironment(environmentId);
            if (response.status === 201) {
                const purchasedEnvironment = environments.find((env) => env.id === environmentId);
                setNewEnvironment(purchasedEnvironment || null);
                setNewInventoryId(response.data.id);
                setPurchaseSuccess(true);
                fetchInventory();
            }
        } catch (error: unknown) {
            setPurchaseError(error.response?.data?.error || "Failed to purchase game environment");
            setTimeout(() => setPurchaseError(null), 5000);
        }
    };

    const handleActivateEnvironment = async (inventoryId: number) => {
        try {
            const response = await ShopDS.activateGameEnvironment(inventoryId);
            if (response.status === 200) {
                fetchInventory();
                if (purchaseSuccess) {
                    handleCloseSuccessModal();
                }
            }
        } catch (error) {
            console.error("Error activating environment:", error);
        }
    };

    const handleCloseSuccessModal = () => {
        setPurchaseSuccess(false);
        setNewEnvironment(null);
        setNewInventoryId(null);
    };

    const isOwned = (envId: number) => {
        return inventory.some((item) => item.game_environment.id === envId);
    };

    const isActive = (envId: number) => {
        return inventory.some((item) => item.game_environment.id === envId && item.is_active);
    };

    const getInventoryId = (envId: number) => {
        const inventoryItem = inventory.find((item) => item.game_environment.id === envId);
        return inventoryItem ? inventoryItem.id : null;
    };

    return {
        environments,
        inventory, 
        loading,
        purchaseSuccess,
        purchaseError,
        newEnvironment,
        newInventoryId,
        handlePurchaseEnvironment,
        handleActivateEnvironment,
        handleCloseSuccessModal,
        setPurchaseError,
        isOwned,
        isActive,
        getInventoryId
    };
};

export default useGameEnvironments;
