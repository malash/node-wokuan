import Wokuan from './wokuan';
import { delay } from 'awaiting';

const main = async () => {
  try {
    const wokuan = new Wokuan();
    await wokuan.init();

    console.log('getAbility:');
    const aiblityData = await wokuan.getAbility();
    console.log(aiblityData);

    console.log('getStatus:');
    const statusData = await wokuan.getStatus();
    console.log(statusData);

    console.log('addStart:');
    const addStartData = await wokuan.addStart();
    console.log(addStartData);

    for (let i = 0; i < 5; i++) {
      await delay(3000);
      console.log('getStatus:');
      const statusData = await wokuan.getStatus();
      console.log(statusData);
      const { status } = statusData;
      if (status === 'APPLY_OK') {
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

main();
