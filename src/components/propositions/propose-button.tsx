import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";

interface ProposeButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function ProposeButton({
  onClick,
  loading,
}: ProposeButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="w-full py-2 text-base font-medium transition-all hover:opacity-90"
    >
      {loading ? <LoadingWheel /> : "🎬 Proposer le film"}
    </Button>
  );
}
