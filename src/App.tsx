import React from "react";
import { Switch, Route } from "wouter";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Coding from "./pages/Coding";
import Cyber from "./pages/Cyber";
import VibeCoding from "./pages/VibeCoding";
import Gaming from "./pages/Gaming";
import Members from "./pages/Members";
import Announcements from "./pages/Announcements";
import Account from "./pages/Account";
import AiDev from "./pages/AiDev";
import Deploy from "./pages/Deploy";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/coding" component={Coding} />
        <Route path="/cyber" component={Cyber} />
        <Route path="/vibe" component={VibeCoding} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/members" component={Members} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/ai-dev" component={AiDev} />
        <Route path="/deploy" component={Deploy} />
        <Route path="/account" component={Account} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}
