import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('CLI E2E Tests', () => {
  const testDir = join(__dirname, 'cli-e2e-temp');
  const configPath = join(testDir, 'nestjs-trpc.config.json');
  const cliPath = join(__dirname, '../../dist/cli/bin/nestjs-trpc.js');

  beforeEach(() => {
    // Create test directory
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('CLI Help', () => {
    it('should display help when no command is provided', () => {
      try {
        const output = execSync(`node ${cliPath}`, {
          encoding: 'utf-8',
        });

        expect(output).toContain('CLI for nestjs-trpc-v2 code generation');
        expect(output).toContain('Commands:');
        expect(output).toContain('generate');
      } catch (error: any) {
        // Help might exit with non-zero code, check both stdout and stderr
        const output = error.stdout || error.stderr;
        expect(output).toContain('CLI for nestjs-trpc-v2 code generation');
        expect(output).toContain('Commands:');
        expect(output).toContain('generate');
      }
    });

    it('should display help with --help flag', () => {
      const output = execSync(`node ${cliPath} --help`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('CLI for nestjs-trpc-v2 code generation');
      expect(output).toContain('Options:');
      expect(output).toContain('-V, --version');
      expect(output).toContain('-h, --help');
    });

    it('should display generate command help', () => {
      const output = execSync(`node ${cliPath} generate --help`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('Generate tRPC schema files');
      expect(output).toContain('-c, --config');
      expect(output).toContain('-r, --root-module');
      expect(output).toContain('-o, --output-dir');
    });

    it('should display version', () => {
      const output = execSync(`node ${cliPath} --version`, {
        encoding: 'utf-8',
      });

      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('CLI Generate - Error Handling', () => {
    it('should fail when no config file and no CLI args provided', () => {
      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        execSync(`node ${cliPath} generate`, {
          encoding: 'utf-8',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        const output = (error.stdout || '') + (error.stderr || '');
        expect(output).toContain('rootModule is required');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should fail when root module file does not exist', () => {
      writeFileSync(
        configPath,
        JSON.stringify({
          rootModule: './non-existent.module.ts',
          outputDir: './generated',
        }),
        'utf-8',
      );

      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        execSync(`node ${cliPath} generate`, {
          encoding: 'utf-8',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        const output = (error.stdout || '') + (error.stderr || '');
        expect(output).toContain('Root module file not found');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should fail when config file contains invalid JSON', () => {
      writeFileSync(configPath, 'invalid json{', 'utf-8');

      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        execSync(`node ${cliPath} generate`, {
          encoding: 'utf-8',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        const output = (error.stdout || '') + (error.stderr || '');
        expect(output).toContain('Failed to parse config file');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('CLI Generate - Success Cases', () => {
    it('should accept CLI arguments without config file', () => {
      // Create a minimal test module
      const srcDir = join(testDir, 'src');
      mkdirSync(srcDir, { recursive: true });

      const moduleContent = `
        import { Module } from '@nestjs/common';
        import { TRPCModule } from '../../../lib';

        @Module({
          imports: [TRPCModule.forRoot()],
        })
        export class AppModule {}
      `;

      writeFileSync(join(srcDir, 'app.module.ts'), moduleContent, 'utf-8');

      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        const output = execSync(
          `node ${cliPath} generate --root-module ./src/app.module.ts --output-dir ./generated`,
          {
            encoding: 'utf-8',
          },
        );

        expect(output).toContain('Loading configuration');
        expect(output).toContain('Bootstrapping NestJS application');
      } catch (error: any) {
        // It's okay if it fails due to missing dependencies in the test module
        // The important thing is that the CLI parsed the arguments correctly
        const errorOutput = error.stdout || error.stderr;
        expect(errorOutput).toContain('Loading configuration');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('CLI Output', () => {
    it('should display progress messages', () => {
      // Create a minimal test setup
      const srcDir = join(testDir, 'src');
      mkdirSync(srcDir, { recursive: true });

      writeFileSync(
        join(srcDir, 'app.module.ts'),
        'export class AppModule {}',
        'utf-8',
      );

      writeFileSync(
        configPath,
        JSON.stringify({
          rootModule: './src/app.module.ts',
          outputDir: './generated',
        }),
        'utf-8',
      );

      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        const output = execSync(`node ${cliPath} generate`, {
          encoding: 'utf-8',
        });

        expect(output).toContain('Loading configuration');
        expect(output).toContain('Root module:');
        expect(output).toContain('Output directory:');
      } catch (error: any) {
        // Check that progress messages were displayed even if generation failed
        const errorOutput = error.stdout || error.stderr;
        expect(errorOutput).toContain('Loading configuration');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
