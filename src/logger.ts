import { LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  log(message: string) {
    console.log(this.color(message));
  }
  error(message: string, trace: string) {
    console.log(this.color(message, 'red'));
  }
  warn(message: string) {
    console.log(this.color(message, 'yellow'));
  }
  debug(message: string) {
    console.log(this.color(message, 'green'));
  }
  verbose(message: string) {
    console.log(this.color(message, 'purple'));
  }

  protected color<T extends string>(message: T, color = '') {
    const COLORS = {
      BLACK: '\u001b[30m',
      RED: '\u001b[31m',
      GREEN: '\u001b[32m',
      YELLOW: '\u001b[33m',
      BLUE: '\u001b[34m',
      MAGENTA: '\u001b[35m',
      CYAN: '\u001b[36m',
      WHITE: '\u001b[37m',
    };

    const printer = (message: T, color: typeof COLORS[keyof typeof COLORS]) => {
      const END = '\u001b[0m';
      return color + message + END;
    };

    switch (color) {
      case 'black':
        return printer(message, COLORS.BLACK);
      case 'red':
        return printer(message, COLORS.RED);
      case 'green':
        return printer(message, COLORS.GREEN);
      case 'blue':
        return printer(message, COLORS.BLUE);
      case 'yellow':
        return printer(message, COLORS.YELLOW);
      case 'cyan':
        return printer(message, COLORS.CYAN);
      case 'cyan':
        return printer(message, COLORS.CYAN);
      case 'white':
        return printer(message, COLORS.WHITE);
      default:
        return message;
    }
  }
}
