import { arrivalPreparationScript } from './arrivalPreparationController';

const preparationCSS = `
#arrival-preparation{display:none}
html[data-arrival-preparing]{overflow:hidden!important}
html[data-arrival-preparing] body::before{content:"";position:fixed;inset:0;z-index:299;background:#f7f2e8}
html[data-arrival-preparing] #arrival-preparation{display:block;position:fixed;inset:0;z-index:300;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,#f7f2e8 0%,#f1edda 27%,#dce3ce 38%,#adcabb 58%,#80aaa0 79%,#5d8e82 100%);color:#264e42}
#arrival-preparation::before{content:"";position:absolute;z-index:0;left:50%;top:35%;width:max(113vw,145vh);max-width:none;aspect-ratio:1691/930;transform:translate(-50%,-40%);background:url('/assets/grebes/atlas-dusk-shoreline.webp') center/100% 100% no-repeat;opacity:.61;mix-blend-mode:multiply;mask-image:linear-gradient(180deg,transparent,#000a 19%,#000 40%,#000 78%,transparent);pointer-events:none}
#arrival-preparation::after{content:"";position:absolute;z-index:0;inset:0;background:linear-gradient(180deg,#f7f2e8c2,transparent 30%),radial-gradient(ellipse 18vw 25vh at 0% 99%,#1f483b47,#29544321 48%,transparent),radial-gradient(ellipse 18vw 25vh at 100% 99%,#1f483b47,#29544321 48%,transparent),radial-gradient(ellipse 39vw 55vh at 53% 59%,#faf2d26b,#f1edcb33 40%,#efeed500),linear-gradient(180deg,#f7f2e800 11%,#f7f2e84d 27.32%,#f7f2e2a1 34.97%,#edecd240 46.7%,#f7f2e800 62%);pointer-events:none}
#arrival-preparation button{position:absolute;z-index:1;top:max(20px,env(safe-area-inset-top));right:max(24px,env(safe-area-inset-right));display:flex;align-items:center;justify-content:space-between;gap:24px;width:max-content;max-width:calc(100vw - 48px);min-height:44px;padding:8px 16px;border:1px solid #536d5438;border-radius:2px;background:#f7f2e8;color:#264e42;font:13px/1.4 sans-serif;cursor:pointer}
#arrival-preparation button:hover{background:#fffaf0;border-color:#536d5470}
#arrival-preparation button:focus-visible{outline:2px solid #176b69;outline-offset:4px}
@media(prefers-reduced-motion:reduce){html[data-arrival-preparing] #arrival-preparation,html[data-arrival-preparing] body::before{display:none}html[data-arrival-preparing]{overflow:visible!important}}
`;

/** Render in the root head so native eligibility runs before the first paint. */
export function ArrivalPreparationHead() {
  return <>
    <style id="arrival-preparation-style" dangerouslySetInnerHTML={{ __html: preparationCSS }} />
    <script id="arrival-preparation-script" dangerouslySetInnerHTML={{ __html: arrivalPreparationScript() }} />
  </>;
}

/** Render first in body. Delegated native controls work before hydration. */
export function ArrivalPreparationBody() {
  return <div id="arrival-preparation" role="dialog" aria-modal="true" aria-label="Grebe opening">
    <button type="button">Skip opening <span aria-hidden="true">↗</span></button>
  </div>;
}
