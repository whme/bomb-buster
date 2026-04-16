import type { GameUser } from "../types/game";

export function buildInviteUrl(inviteCode: string): string {
  return `${window.location.origin}/bomb-buster/#/join/${inviteCode}`;
}

export function canStartGame(players: GameUser[], captainUserId: string | null): boolean {
  return players.length >= 2 && captainUserId !== null;
}
