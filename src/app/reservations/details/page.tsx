
'use client';

// This page is no longer in use as the functionality has been moved to the confirm page.
// It is kept to prevent 404 errors from old links but should be removed in a future update.

import { useRouter, useSearchParams, Suspense } from "next/navigation";
import { useEffect } from "react";

function Redirector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        router.replace(`/reservations/confirm?${newParams.toString()}`);
    }, [router, searchParams]);
    
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Redirecting...</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Please wait while we take you to the updated booking page.
                </p>
            </div>
        </div>
    );
}

export default function DeprecatedReservationDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Redirector />
        </Suspense>
    )
}
