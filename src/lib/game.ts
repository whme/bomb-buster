import type { GamePlayer } from "../types/game";

export function buildInviteUrl(inviteCode: string): string {
  return `${window.location.origin}/bomb-buster/#/join/${inviteCode}`;
}

export function canStartGame(players: GamePlayer[], captainPlayerId: string | null): boolean {
  return players.length >= 2 && captainPlayerId !== null;
}
