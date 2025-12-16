import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: 32, paddingBottom: 32, display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner size="large" />
        </div>
    );
}
