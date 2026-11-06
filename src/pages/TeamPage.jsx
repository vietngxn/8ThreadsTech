import TeamHeader from "../components/team/TeamHeader";
import TeamHero from "../components/team/TeamHero";
import TeamMembers from "../components/team/TeamMembers";
import TeamValues from "../components/team/TeamValues";
import TeamContact from "../components/team/TeamContact";

export default function TeamPage() {
  return (
    <main className="team-page" id="top" data-node-id="27:751">
      <TeamHeader />
      <TeamHero />
      <TeamMembers />
      <TeamValues />
      <TeamContact />
    </main>
  );
}