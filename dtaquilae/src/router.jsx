import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/authentication/Login.jsx";
import Signup from "./views/authentication/Signup";
import Users from "./views/users/Users.jsx";
import Questions from "./views/questions/Questions.jsx";
import GererQuestion from "./views/questions/GererQuestion.jsx";
import CreeUtilisateur from "./views/users/GererUtilisateur.jsx";
import DefaultLayout from "./components/layouts/DefaultLayout.jsx";
import GuestLayout from "./components/layouts/GuestLayout.jsx";
import StagiaireLayout from "./components/layouts/StagiaireLayout.jsx"
import Dashboard from "./Dashboard.jsx";
import NotFound from "./views/errors/NotFound.jsx";
import DashboardStagiaire from "./views/stagiaire/Dashboard.jsx";
import StageForm from "./views/stage/StageForm.jsx";
import Stages from "./views/stage/Stages.jsx";
import Questionnaires from "./views/questionnaires/Questionnaires.jsx";
import GererQuestionnaire from "./views/questionnaires/GererQuestionnaire.jsx";
import Tests from "./views/gerertest/Tests.jsx";
import PasserTest from "./views/gerertest/PasserTest.jsx";
import GererTest from "./views/gerertest/GererTest.jsx";
import SaisieManuelle from "./views/gerertest/SaisieManuelle.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to={'/dashboard'}/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/users/:id',
        element: <CreeUtilisateur key="creeUtilisateur"/>
      },
      {
        path: '/questions/:id',
        element: <GererQuestion key="questionUpdate"/>
      },
      {
        path: '/questions',
        element: <Questions/>
      },
      {
        path: '/questions/new',
        element: <GererQuestion/>
      },

      {
        path: '/stages',
        element: <Stages/>
      },
      {
        path: '/stages/add',
        element: <StageForm key="stageAdd"/>
      },
      {
        path: '/stages/:id',
        element: <StageForm key="stageUpdate"/>
      },
      {
        path: '/questionnaires',
        element: <Questionnaires/>
      },
      {
        path: '/questionnaires/add',
        element: <GererQuestionnaire/>
      },
      {
        path: '/questionnaires/:id',
        element: <GererQuestionnaire/>
      },
      {
        path: '/tests',
        element: <Tests/>
      },
      {
        path: '/tests/add',
        element: <GererTest/>
      },
      {
        path: '/tests/:id',
        element: <SaisieManuelle/>
      },
    ],
    errorElement: <NotFound/>
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      },
    ]
  },
  {
    path: '/',
    element: <StagiaireLayout/>,
    children: [
      {
        path: '/stagiaire/accueil',
        element: <DashboardStagiaire/>
      },
      {
        path: '/questionnaires/testStagiaire/:id',
        element: <PasserTest/>
      },
    ]
  }
])

export default router;