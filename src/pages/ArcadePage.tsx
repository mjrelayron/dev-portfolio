import { Seo } from '../app/Seo';
import { ArcadeHub } from '../arcade/ArcadeHub';
import '../arcade/arcade.css';

export default function ArcadePage() {
  return (
    <>
      <Seo
        title="Arcade"
        description="Mini-games built into the portfolio: Stack Builder, Bug Hunter, Project Explorer and Workflow Challenger — plus the achievement trophy case."
        path="/arcade"
      />
      <ArcadeHub />
    </>
  );
}
