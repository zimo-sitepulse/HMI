import {test,expect} from '@playwright/test';
test('touch panel loads local brand assets and fits landscape screen',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Ready for the operation.'})).toBeVisible();
 for(const img of await page.locator('img').all()) expect(await img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
 const buttons=await page.locator('button:visible').evaluateAll(elements=>elements.map(el=>({label:el.textContent,height:el.getBoundingClientRect().height})));
 for(const b of buttons) expect(b.height,`${b.label} touch height`).toBeGreaterThanOrEqual(48);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBeLessThanOrEqual(800);
 expect(errors).toEqual([]);
});
test('start and stop require confirmation, cancellation preserves state',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start / Stop',exact:true}).click();
 await page.getByRole('button',{name:'Stop unit',exact:true}).click();await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Unit is running'})).toBeVisible();
 await page.getByRole('button',{name:'Stop unit',exact:true}).click();await page.getByRole('button',{name:'Confirm stop'}).click();
 await expect(page.getByRole('heading',{name:'Unit is stopped'})).toBeVisible();
 await page.getByRole('button',{name:'Start unit',exact:true}).click();await page.getByRole('button',{name:'Confirm start'}).click();
 await expect(page.getByRole('heading',{name:'Unit is running'})).toBeVisible();
});
test('temperature, modes, fan speed and acknowledgement update across views',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Comfort',exact:true}).click();
 for(let i=0;i<10;i++) {const b=page.getByRole('button',{name:'Øk temperatur'});if(await b.isEnabled())await b.click();}
 await expect(page.getByRole('button',{name:'Øk temperatur'})).toBeDisabled();
 await page.getByRole('button',{name:'Manual',exact:true}).click();
 await page.getByRole('button',{name:'Ventilation',exact:true}).click();await page.getByRole('button',{name:'Øk viftehastighet'}).click();
 await page.getByRole('button',{name:'Home',exact:true}).click();await expect(page.getByText('70',{exact:false}).first()).toBeVisible();
 await expect(page.getByText('Manual mode',{exact:true})).toBeVisible();await expect(page.getByText('Target temperature 28 °C')).toBeVisible();
 await page.getByRole('button',{name:'Acknowledge'}).click();await expect(page.getByText('Notice acknowledged',{exact:true})).toBeVisible();
});
test('all eight pages render and compact layout avoids horizontal overflow',async({page})=>{
 await page.setViewportSize({width:768,height:1024});await page.goto('/');
 for(const name of ['Comfort','Start / Stop','Ventilation','Fire & Gas','HVAC','UPS / Power','Commission','Home']){
  await page.getByRole('navigation').getByRole('button',{name,exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(768);
 }
});
