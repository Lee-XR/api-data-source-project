import { useRef } from "react";

export function useAbortRequest() {
    const abortControllerRef = useRef(new AbortController());
    const requestAbortController = abortControllerRef.current;
    const requestAbortSignal = requestAbortController.signal;

    return { requestAbortController, requestAbortSignal };
}