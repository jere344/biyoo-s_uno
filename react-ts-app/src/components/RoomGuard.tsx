import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext';

interface RoomGuardProps {
  children: React.ReactNode;
}

const RoomGuard: React.FC<RoomGuardProps> = ({ children }) => {
  const { currentRoomId } = useRoom();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of paths that are allowed even if user is in a room
    const allowedPaths = [
      `/room/${currentRoomId}`,
      '/login',
      '/logout',
      '/user-edit/me',
      '/password-edit/me',
      '/delete-me',
    ];
    
    // Check if current path is not allowed
    if (currentRoomId && !allowedPaths.some(path => location.pathname.startsWith(path))) {
      navigate(`/room/${currentRoomId}`);
    }
  }, [currentRoomId, location.pathname, navigate]);

  return <>{children}</>;
};

export default RoomGuard;
