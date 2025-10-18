const mockGetInput: jest.Mock<string, [string, InputOptions]> = jest.fn();
const mockGetBooleanInput: jest.Mock<boolean, [string, InputOptions]> = jest.fn();

jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  getInput: mockGetInput,
  getBooleanInput: mockGetBooleanInput,
}));

import { InputOptions } from '@actions/core';
import {
  Color,
  RepresentationType,
  SarifToSlackClient,
  SarifToSlackClientOptions,
  SendIf
} from '@fabasoad/sarif-to-slack';
import run from '../run';

describe('(unit): run', (): void => {
  const expectedPropsMap = new Map<string, string>([
    ['sarif-file-extension', 'sarif'],
    ['log-level', 'warning'],
    ['log-colored', 'true'],
    ['representation', 'compact-group-by-tool-name-per-severity'],
    ['send-if', 'severity-high-or-higher']
  ]);

  beforeAll((): void => {
    [
      'color',
      'color-empty',
      'color-level-error',
      'color-level-warning',
      'color-level-note',
      'color-level-none',
      'color-level-unknown',
      'color-severity-critical',
      'color-severity-high',
      'color-severity-medium',
      'color-severity-low',
      'color-severity-none',
      'color-severity-unknown',
    ].forEach((prop: string): void => {
      expectedPropsMap.set(prop, `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`);
    })
  })

  beforeEach((): void => {
    mockGetInput.mockImplementation(
      (name: string, opts?: InputOptions): string => {
        expect(opts).not.toBeFalsy();
        expect(opts?.required).toBe(['slack-webhook', 'sarif-path'].includes(name));
        expect(opts?.trimWhitespace).toBe(name !== 'log-template');
        return expectedPropsMap.get(name) ?? `${name}-test`;
      }
    );
    mockGetBooleanInput.mockImplementation(
      (name: string, opts?: InputOptions): boolean => {
        switch (name) {
          case 'sarif-path-recursive':
          case 'include-header':
          case 'include-footer':
          case 'include-actor':
          case 'include-run':
            expect(opts).not.toBeFalsy();
            expect(opts?.required).toBe(false);
            expect(opts?.trimWhitespace).toBe(true);
            return true;
          default:
            fail(`Unhandled parameter "${name}"`);
        }
      }
    )
  })

  afterEach((): void => {
    jest.clearAllMocks();
  })

  test('should send Sarif to Slack', async (): Promise<void> => {
    const mockSend: jest.Mock<Promise<void>, []> = jest.fn();
    const mockFrom: jest.SpyInstance<Color | undefined, [string | undefined]> = jest
      .spyOn(Color, 'from')
      .mockImplementation((color: string | undefined): Color | undefined => ({
        color
      } as Color));
    const mockCreate: jest.SpyInstance<Promise<SarifToSlackClient>, [string, SarifToSlackClientOptions]> = jest
      .spyOn(SarifToSlackClient, 'create')
      .mockImplementation((webhookUrl: string, opts: SarifToSlackClientOptions): Promise<SarifToSlackClient> => {
        expect(webhookUrl).toBe('slack-webhook-test');
        expect(opts.username).toBe('username-test');
        expect(opts.iconUrl).toBe('icon-url-test');
        expect(opts.color?.default?.color).toBe(expectedPropsMap.get('color'));
        expect(opts.color?.empty?.color).toBe(expectedPropsMap.get('color-empty'));
        expect(opts.color?.byLevel?.error?.color).toBe(expectedPropsMap.get('color-level-error'));
        expect(opts.color?.byLevel?.warning?.color).toBe(expectedPropsMap.get('color-level-warning'));
        expect(opts.color?.byLevel?.note?.color).toBe(expectedPropsMap.get('color-level-note'));
        expect(opts.color?.byLevel?.none?.color).toBe(expectedPropsMap.get('color-level-none'));
        expect(opts.color?.byLevel?.unknown?.color).toBe(expectedPropsMap.get('color-level-unknown'));
        expect(opts.color?.bySeverity?.critical?.color).toBe(expectedPropsMap.get('color-severity-critical'));
        expect(opts.color?.bySeverity?.high?.color).toBe(expectedPropsMap.get('color-severity-high'));
        expect(opts.color?.bySeverity?.medium?.color).toBe(expectedPropsMap.get('color-severity-medium'));
        expect(opts.color?.bySeverity?.low?.color).toBe(expectedPropsMap.get('color-severity-low'));
        expect(opts.color?.bySeverity?.none?.color).toBe(expectedPropsMap.get('color-severity-none'));
        expect(opts.color?.bySeverity?.unknown?.color).toBe(expectedPropsMap.get('color-severity-unknown'));
        expect(opts.sarif.path).toBe('sarif-path-test');
        expect(opts.sarif.recursive).toBe(true);
        expect(opts.sarif.extension).toBe('sarif');
        expect(opts.header?.include).toBe(true);
        expect(opts.header?.value).toBe('header-test');
        expect(opts.footer?.include).toBe(true);
        expect(opts.footer?.value).toBe('footer-test');
        expect(opts.actor?.include).toBe(true);
        expect(opts.actor?.value).toBe('actor-test');
        expect(opts.run?.include).toBe(true);
        expect(opts.representation).toBe(RepresentationType.CompactGroupByToolNamePerSeverity);
        expect(opts.sendIf).toBe(SendIf.SeverityHighOrHigher);
        return Promise.resolve({
          send: mockSend
        } as unknown as SarifToSlackClient);
      });
    await run();
    expect(process.env.SARIF_TO_SLACK_LOG_LEVEL).toBe('warning');
    expect(process.env.SARIF_TO_SLACK_LOG_TEMPLATE).toBe('log-template-test');
    expect(process.env.SARIF_TO_SLACK_LOG_COLORED).toBe('true');
    expect(mockFrom).toHaveBeenCalledTimes(13);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledTimes(1);
  })
})
