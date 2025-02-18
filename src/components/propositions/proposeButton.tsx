import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";

interface ProposeButtonProps {
    onClick: () => void,
    loading: boolean
}

export default function ProposeButton({onClick, loading}: ProposeButtonProps) {
    return loading ? (
            <Button variant="outline" disabled>
                <LoadingWheel/>
            </Button>)
        : (
            <Button variant="outline" onClick={ onClick }>
                Proposer le film
            </Button>
        );
}