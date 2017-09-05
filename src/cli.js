import program from 'commander';
import prettyjson from 'prettyjson';
import ora from 'ora';
import { version } from '../package.json';
import { delay } from 'awaiting';
import Wokuan from '.';

const verbose = (data) => {
  if (program.verbose) {
    console.log();
    console.log(prettyjson.render(data || ''));
    console.log();
  }
}

const wokuanReady = async options => {
  const spinner = ora('初始化').start();
  try {
    const wokuan = new Wokuan(options);
    await wokuan.init();
    spinner.succeed(`初始化: 使用UUID ${wokuan.__data.devId}`);
    console.log('🔧 是时候表演真正的技术了');
    return wokuan;
  } catch (e) {
    spinner.fail('初始化失败');
    console.error(e);
    process.exit();
  }
}

program
  .version(version)
  .option('--verbose', '详细模式');

program
  .command('info')
  .description('基本信息')
  .action(async () => {
    const wokuan = await wokuanReady();
    const spinner = ora('获取基本信息').start();
    const aiblityData = await wokuan.getAbility();
    spinner.succeed(`获取基本信息`);
    verbose(aiblityData);
  });

const STATUS_MAP = {
  RESET_OK: '就绪',
  APPLY_OK: '成功',
};
const getStatusMap = status =>
  STATUS_MAP[status] ? `${STATUS_MAP[status]} (${status})` : `未知状态 (${status})`;

program
  .command('status')
  .description('加速状态')
  .action(async () => {
    const wokuan = await wokuanReady();
    const spinner = ora('获取加速状态').start();
    try {
      const statusData = await wokuan.getStatus();
      const { status, userSpeedupLength } = statusData;
      spinner.succeed(`获取加速状态: ${getStatusMap(status)}, 可用时间 ${userSpeedupLength} 分钟`);
      verbose(statusData);
    } catch (e) {
      spinner.fail('获取加速状态失败');
      console.error(e);
    }
  });

program
  .command('start')
  .description('开始加速')
  .action(async () => {
    const wokuan = await wokuanReady();
    const spinner = ora('开始加速').start();
    try {
      // 加速前必须先调用status
      const statusData = await wokuan.getStatus();
      const { status, userSpeedupLength } = statusData;
      spinner.info(`获取加速状态成功 状态: ${getStatusMap(status)}, 可用时间 ${userSpeedupLength} 分钟`);
      verbose(statusData);
      if (status === 'APPLY_OK') {
        spinner.succeed('已生效，无需再次加速⚡️');
        return;
      }
      const addStartData = await wokuan.addStart();
      verbose(addStartData);
      spinner.succeed('加速成功⚡️');
    } catch (e) {
      spinner.fail('加速失败');
      console.error(e);
      return;
    }
  });

program
  .command('stop')
  .description('停止加速')
  .action(async () => {
    const wokuan = await wokuanReady();
    const spinner = ora('停止加速').start();
    try {
      // 加速前必须先调用status
      const statusData = await wokuan.getStatus();
      const { status, userSpeedupLength } = statusData;
      verbose(statusData);
      spinner.info(`获取加速状态成功 状态: ${getStatusMap(status)}, 可用时间 ${userSpeedupLength} 分钟`);
      if (status === 'RESET_OK') {
        spinner.succeed('已生效，无需再次停止');
        return;
      }
      const addStopData = await wokuan.addStop();
      verbose(addStopData);
      spinner.succeed('停止成功');
    } catch (e) {
      spinner.fail('停止失败');
      console.error(e);
      return;
    }
  });

program
  .command('refresh')
  .description('更新UUID')
  .action(async () => {
    const spinner = ora('更新UUID').start();
    const wokuan = await wokuanReady({
      refresh: true,
    });
    spinner.succeed('更新UUID成功');
    try {
      const spinner = ora('更新UUID').start();
      const statusData = await wokuan.getStatus();
      const { status, userSpeedupLength } = statusData;
      verbose(statusData);
      spinner.succeed(`更新加速状态: ${getStatusMap(status)}, 可用时间 ${userSpeedupLength} 分钟`);
    } catch (e) {
      spinner.fail('更新加速状态失败');
      console.error(e);
    }
  });

const MIN_TIME_TO_CHECK = 2;

program
  .command('auto')
  .description('自动加速')
  .action(async () => {
    const wokuan = await wokuanReady();
    while (true) {
      const spinnerRunning = ora('加速生效中...');
      try {
        let statusData;
        // 寻找可用UUID
        while (true) {
          // 加速前必须先调用status
          const spinnerStatus = ora('获取加速状态').start();
          statusData = await wokuan.getStatus();
          const { status, userSpeedupLength } = statusData;
          verbose(statusData);
          if (userSpeedupLength > MIN_TIME_TO_CHECK) {
            spinnerStatus.succeed(`获取加速状态成功 状态: ${getStatusMap(status)}, 可用时间 ${userSpeedupLength} 分钟, 当前时间 ${Date()}`);
            break;
          } else {
            spinnerStatus.info(`该UUID可用时间小于${MIN_TIME_TO_CHECK}分钟，需要更新`);
            wokuan.refreshDevId();
            spinnerStatus.succeed(`该UUID可用时间小于${MIN_TIME_TO_CHECK}分钟，更新成功 使用UUID ${wokuan.__data.devId}`);
            continue;
          }
        }
        const { status } = statusData;
        if (status !== 'APPLY_OK') {
          const spinnerStart = ora('开始加速').start();
          const addStartData = await wokuan.addStart();
          verbose(addStartData);
          spinnerStart.succeed('加速成功⚡️');
        }
        spinnerRunning.start();
      } catch (e) {
        ora('遇到问题').fail('遇到问题，稍后重试').stop();
        console.error(e);
      }
      await delay(60 * 1000);
      spinnerRunning.stop();
    }
  });

program.parse(process.argv);
