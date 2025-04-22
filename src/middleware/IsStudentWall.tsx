import FlexibleErrorPage from "@/pages/global/FlexibleErrorPage";
import isStudent from "@/utils/isStudent";
import { Outlet } from "react-router-dom";

const IsStudentWall = () => {
  return isStudent() ? (
    <Outlet />
  ) : (
    <FlexibleErrorPage
      errorCode={403}
      errorMessage="Accès refusé"
      userFriendlyMessage="Vous n'avez pas accès à cette page."
    />
  );
};

export default IsStudentWall;