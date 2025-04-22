import FlexibleErrorPage from "@/pages/global/FlexibleErrorPage";
import isTeacher from "@/utils/isTeacher";
import { Outlet } from "react-router-dom";

const IsTeacherWall = () => {
  return isTeacher() ? (
    <Outlet />
  ) : (
    <FlexibleErrorPage
      errorCode={403}
      errorMessage="Accès refusé"
      userFriendlyMessage="Vous n'avez pas accès à cette page."
    />
  );
};

export default IsTeacherWall;