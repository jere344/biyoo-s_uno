import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem } from '@mui/material';

interface MemoryGameRulesProps {
    open: boolean;
    onClose: () => void;
}

export default function MemoryGameRules({ open, onClose }: MemoryGameRulesProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Règles du Jeu de Mémoire</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Le but du jeu est de trouver toutes les paires d'images identiques.
                </Typography>
                <List>
                    <ListItem>1. Cliquez sur deux cartes pour les retourner</ListItem>
                    <ListItem>2. Si les images sont identiques, les cartes restent visibles</ListItem>
                    <ListItem>3. Si les images sont différentes, les cartes se retournent après un court délai</ListItem>
                    <ListItem>4. Le jeu se termine quand toutes les paires sont trouvées</ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
}
