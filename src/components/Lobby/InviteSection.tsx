import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useGameContext } from "../../contexts/GameContext";
import { buildInviteUrl } from "../../lib/game";

export function InviteSection() {
  const { game } = useGameContext();
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const inviteUrl = buildInviteUrl(game.invite_code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-gray-800 p-6">
      <h2 className="mb-4 text-lg font-semibold">Invite Players</h2>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="rounded-lg bg-white p-3">
          <QRCodeSVG value={inviteUrl} size={160} />
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-gray-400">
            Share this link or scan the QR code to join:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-gray-900 px-3 py-2 text-sm text-gray-300">
              {inviteUrl}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-gray-700 px-3 py-2 text-sm transition hover:bg-gray-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
