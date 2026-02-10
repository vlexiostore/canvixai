// @ts-nocheck
"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Pixlr Editor Embed Component
 *
 * Embeds the Pixlr editor in an iframe using their SDK.
 * The user can open images, edit them with Pixlr's full tools,
 * and get the edited file back.
 */
export default function PixlrEditorEmbed({
  onSave,
  onClose,
}: {
  onSave?: (file: File) => void;
  onClose?: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  // Fetch JWT token from our backend
  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/pixlr/token", { method: "POST" });
        const json = await res.json();
        if (json.success && json.data.token) {
          setToken(json.data.token);
        } else {
          setError("Failed to authenticate with Pixlr");
        }
      } catch (e) {
        setError("Could not connect to Pixlr");
      } finally {
        setLoading(false);
      }
    }
    fetchToken();
  }, []);

  // Initialize Pixlr SDK once we have a token
  useEffect(() => {
    if (!token || !iframeRef.current) return;

    let editor: any = null;

    async function initEditor() {
      try {
        const { Editor } = await import("@pixlrlte/pixlr-sdk");
        editor = await Editor.connect(token, iframeRef.current);
        setEditorReady(true);
        setLoading(false);
      } catch (e) {
        console.error("Pixlr SDK init error:", e);
        setError("Failed to initialize Pixlr editor. Check your API keys.");
        setLoading(false);
      }
    }

    initEditor();

    return () => {
      // Cleanup if needed
      editor = null;
    };
  }, [token]);

  // Handle file open
  const handleFileOpen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      try {
        const { Editor } = await import("@pixlrlte/pixlr-sdk");
        const editor = await Editor.connect(token!, iframeRef.current!);

        for await (const newFile of editor.open(file)) {
          // User saved the file in the editor
          if (onSave) {
            onSave(newFile);
          }
        }
      } catch (e) {
        console.error("Error opening file in Pixlr:", e);
      }
    },
    [token, onSave]
  );

  const styles = {
    container: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#0a0a0b",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column" as const,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 20px",
      backgroundColor: "#1a1a1f",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "white",
      fontSize: "16px",
      fontWeight: "600" as const,
    },
    btn: {
      padding: "8px 16px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.15)",
      backgroundColor: "rgba(255,255,255,0.05)",
      color: "white",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500" as const,
      transition: "all 0.2s",
    },
    closeBtn: {
      padding: "8px 16px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "rgba(239,68,68,0.15)",
      color: "#f87171",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500" as const,
    },
    iframe: {
      flex: 1,
      width: "100%",
      border: "none",
      backgroundColor: "#18181b",
    },
    loadingOverlay: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      color: "rgba(255,255,255,0.6)",
      fontSize: "15px",
    },
    errorBox: {
      padding: "20px",
      backgroundColor: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: "12px",
      color: "#f87171",
      textAlign: "center" as const,
      maxWidth: "400px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #FF6B35, #EC4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              C
            </span>
            <span>Pixlr Editor</span>
          </div>

          {editorReady && (
            <>
              <button
                style={styles.btn}
                onClick={() => fileInputRef.current?.click()}
              >
                Open Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileOpen}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        {onClose && (
          <button style={styles.closeBtn} onClick={onClose}>
            Close Editor
          </button>
        )}
      </div>

      {/* Editor iframe or loading state */}
      {loading ? (
        <div style={styles.loadingOverlay}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#7C3AED",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <span>Loading Pixlr Editor...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={styles.loadingOverlay}>
          <div style={styles.errorBox}>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
              Editor Error
            </p>
            <p>{error}</p>
            <p style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              Make sure your Pixlr API key and secret are set in .env.local
            </p>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          style={styles.iframe}
          title="Pixlr Editor"
          allow="clipboard-write"
        />
      )}
    </div>
  );
}
