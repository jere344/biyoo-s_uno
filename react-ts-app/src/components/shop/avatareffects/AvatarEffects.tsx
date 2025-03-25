import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardMedia } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import InventoryIcon from "@mui/icons-material/Inventory";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CloseIcon from "@mui/icons-material/Close";
import AvatarEffectItem from "./AvatarEffectItem";
import { useUser } from "@hooks/useUser";
import ShopDS from "@DS/ShopDS";
import IProfileEffect from "@DI/IProfileEffect";

const AvatarEffects: React.FC<AvatarEffectsProps> = () => {
  const { user } = useUser();
  const [profileEffects, setProfileEffects] = useState<IProfileEffect[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [newEffect, setNewEffect] = useState<IProfileEffect | null>(null);
  const [newInventoryId, setNewInventoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [effectsResponse, inventoryResponse] = await Promise.all([
        ShopDS.getProfileEffects(),
        ShopDS.getProfileEffectInventory()
      ]);
      setProfileEffects(effectsResponse.data);
      setInventory(inventoryResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await ShopDS.getProfileEffectInventory();
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleBuy = async (effectId: number) => {
    try {
      const response = await ShopDS.purchaseProfileEffect(effectId);
      if (response.status === 201) {
        // Get the effect details to show in the modal
        const purchasedEffect = profileEffects.find((effect) => effect.id === effectId);
        setNewEffect(purchasedEffect || null);
        setNewInventoryId(response.data.id);
        setPurchaseSuccess(true);
        fetchInventory(); // Refresh inventory
      }
    } catch (error: any) {
      setPurchaseError(error?.response?.data?.error || "Failed to purchase effect");
      setTimeout(() => setPurchaseError(null), 5000);
    }
  };

  const handleEquip = async (inventoryId: number) => {
    try {
      const response = await ShopDS.activateProfileEffect(inventoryId);
      if (response.status === 200) {
        fetchInventory(); // Refresh inventory
        // Close the modal if we're activating from the modal
        if (purchaseSuccess) {
          handleCloseSuccessModal();
        }
      }
    } catch (error) {
      console.error("Error equipping effect:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setPurchaseSuccess(false);
    setNewEffect(null);
    setNewInventoryId(null);
  };

  // Filter shop effects to exclude those already in inventory
  const shopEffects = profileEffects.filter(
    effect => !inventory.some(item => item.profile_effect.id === effect.id)
  );

  return (
    <>
      {/* Purchase Success Modal */}
      <Dialog
        open={purchaseSuccess && newEffect !== null}
        onClose={handleCloseSuccessModal}
        PaperProps={{
          style: {
            borderRadius: "20px",
            backgroundColor: "rgba(55, 65, 81, 0.95)",
            padding: "10px",
            boxShadow: "0 0 30px rgba(224, 64, 251, 0.6)",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            textAlign: "center",
            fontSize: "1.8rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #e040fb 0%, #aa00ff 100%)",
            borderRadius: "10px",
            marginBottom: "15px",
            padding: "15px",
          }}
        >
          Achat Réussi !
        </DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          {newEffect && (
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CardMedia
                  component="img"
                  image={newEffect.image}
                  alt={newEffect.name}
                  sx={{
                    height: "250px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    margin: "0 auto 20px",
                  }}
                />
                <Typography variant="h5" sx={{ color: "#fff", marginBottom: "15px" }}>
                  {newEffect.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc", marginBottom: "20px" }}>
                  Cet effet a été ajouté à votre collection !
                </Typography>
              </motion.div>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "10px 20px 20px" }}>
          <Button
            onClick={() => newInventoryId !== null && handleEquip(newInventoryId)}
            sx={{
              background: "linear-gradient(45deg, #e040fb 30%, #aa00ff 90%)",
              color: "white",
              fontWeight: "bold",
              padding: "10px 25px",
              borderRadius: "25px",
              boxShadow: "0 4px 20px rgba(224, 64, 251, 0.5)",
              margin: "0 10px",
              fontSize: "1rem",
            }}
          >
            Équiper
          </Button>
          <Button
            onClick={handleCloseSuccessModal}
            startIcon={<CloseIcon />}
            sx={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "10px 25px",
              borderRadius: "25px",
              margin: "0 10px",
              fontSize: "1rem",
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Error Snackbar */}
      <Snackbar
        open={purchaseError !== null}
        autoHideDuration={5000}
        onClose={() => setPurchaseError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            fontSize: "1rem",
            fontWeight: "medium",
          }}
          onClose={() => setPurchaseError(null)}
        >
          {purchaseError}
        </Alert>
      </Snackbar>

      {/* Store Items */}
      <Box sx={{ marginBottom: 6 }}>
        <Box
          sx={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "15px 25px",
            borderRadius: "20px 20px 0 0",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardGiftcardIcon sx={{ fontSize: 32, marginRight: 2, color: "#e040fb" }} />
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Effets disponibles
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: "center", padding: 5 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Chargement des effets...
              </Typography>
            </Grid>
          ) : shopEffects.length > 0 ? (
            shopEffects.map((effect) => (
              <AvatarEffectItem 
                key={effect.id} 
                effect={effect} 
                user={user} 
                isOwned={false} 
                isEquipped={false} 
                onPress={() => handleBuy(effect.id)} 
              />
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  padding: 5,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: "15px",
                }}
              >
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Tous les effets sont déjà dans votre collection !
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Inventory */}
      <Box sx={{ marginTop: 6 }}>
        <Box
          sx={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "15px 25px",
            borderRadius: "20px 20px 0 0",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <InventoryIcon sx={{ fontSize: 32, marginRight: 2, color: "#4caf50" }} />
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Votre Collection
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <AnimatePresence>
            {!loading && inventory.length > 0 ? (
              inventory.map((item) => (
                <AvatarEffectItem 
                  key={item.id} 
                  effect={item.profile_effect} 
                  user={user} 
                  isOwned={true} 
                  isEquipped={item.is_active} 
                  onPress={() => handleEquip(item.id)} 
                />
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: 5,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: "15px",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    Vous n'avez pas encore d'effets. Achetez-en dans la boutique!
                  </Typography>
                </Box>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          padding: 3,
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: "15px",
          marginTop: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Ces effets ne seront pas visibles pendant les parties.
        </Typography>
      </Box>
    </>
  );
};

export default AvatarEffects;
