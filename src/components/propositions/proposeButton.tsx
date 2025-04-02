import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";

interface ProposeButtonProps {
    onClick: () => void,
    loading: boolean
}

export default function ProposeButton({onClick, loading}: ProposeButtonProps) {
    return loading ? (
            <Button className="w-full" disabled>
                <LoadingWheel/>
            </Button>)
        : (
            <Button className="w-full" onClick={ onClick }>
                Proposer le film
            </Button>
        );
}