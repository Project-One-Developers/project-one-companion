import { toast } from "@/components/hooks/use-toast";

export function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (Array.isArray(data)) {
                window.localStorage.setItem("players", JSON.stringify(data));
                toast({
                    title: "Caricamento completato",
                    description: "Il file JSON è stato caricato con successo.",
                });
            } else {
                toast({
                    title: "Errore di caricamento",
                    description: "Il file JSON non è nel formato corretto.",
                });
            }
        } catch (error) {
            toast({
                title: "Errore di caricamento",
                description: "C'è stato un errore nella lettura del file JSON.",
            });
        }
    };
    reader.readAsText(file);
}
