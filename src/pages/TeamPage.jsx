import Navbar from "../components/common/Navbar";
import TeamHero from "../components/team/TeamHero";
import TeamMembers from "../components/team/TeamMembers";
import TeamValues from "../components/team/TeamValues";
import TeamContact from "../components/team/TeamContact";
import useTeamPageAnimation from "../hooks/useTeamPageAnimation";
import { useScrollTriggerRefresh } from "../hooks/useResponsiveAnimation";

export default function TeamPage() {
  const pageRef = useTeamPageAnimation();
  useScrollTriggerRefresh();

  return (
    <main ref={pageRef} className="team-page" id="top" data-node-id="27:751">
      <Navbar />
      <TeamHero />
      <TeamMembers />
      <TeamValues />
      <TeamContact />
    </main>
  );
}