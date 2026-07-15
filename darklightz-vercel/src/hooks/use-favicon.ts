import { useEffect } from "react"
import { useGetSiteSettings } from "@/lib/api-client"

/**
 * Reads faviconUrl from site settings and applies it to the browser tab.
 * Falls back to the static /favicon.png if no custom favicon is saved.
 * Mount this once at the app root.
 */
export function useFavicon() {
  const { data: settings } = useGetSiteSettings()

  useEffect(() => {
    const faviconUrl = settings?.faviconUrl
    if (!faviconUrl) return

    // Find the favicon link tag inserted in index.html
    const link =
      document.getElementById("dl-favicon") as HTMLLinkElement | null
      ?? document.querySelector<HTMLLinkElement>("link[rel~='icon']")

    if (!link) return

    link.href = faviconUrl
    // Detect mime type from data URL prefix or extension
    if (faviconUrl.startsWith("data:image/svg")) {
      link.type = "image/svg+xml"
    } else if (faviconUrl.startsWith("data:image/webp")) {
      link.type = "image/webp"
    } else {
      link.type = "image/png"
    }
  }, [settings?.faviconUrl])
}
