import { useLocation } from "react-router";

export function useRoomName(defaultRoom = "general") {
  const { search } = useLocation();

  const raw = search.slice(1);

  const roomName = /^[a-z0-9-]+$/i.test(raw) ? raw : defaultRoom;

  return roomName;
}
