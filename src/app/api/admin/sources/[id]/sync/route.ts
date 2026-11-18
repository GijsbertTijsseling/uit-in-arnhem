import { NextRequest, NextResponse } from 'next/server';
import { getAgendaSources } from '@/lib/supabase/api';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sources = await getAgendaSources();
    const targetSource = sources.find((s) => s.id === id || s.slug === id);

    if (id !== 'all' && !targetSource) {
      return NextResponse.json({ error: 'Bron niet gevonden' }, { status: 404 });
    }

    const sourceSlug = targetSource ? targetSource.slug : undefined;
    const projectRoot = process.cwd();
    // Resolve python binary dynamically to avoid Turbopack static asset analysis on venv symlinks
    const venvDir = ['scraper', '.' + 'venv', 'bin', 'python'].join('/');
    const fullVenvPath = path.resolve(/*turbopackIgnore: true*/ projectRoot, venvDir);
    const pythonBin = process.env.PYTHON_PATH || fullVenvPath;
    const mainScript = path.resolve(/*turbopackIgnore: true*/ projectRoot, 'scraper', 'main.py');

    const cmd = sourceSlug
      ? `"${pythonBin}" "${mainScript}" --source ${sourceSlug}`
      : `"${pythonBin}" "${mainScript}"`;

    console.log(`Executing manual scraper sync: ${cmd}`);

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: projectRoot,
        env: { ...process.env, PYTHONPATH: projectRoot },
        timeout: 120000, // 2 minutes timeout for single source
      });

      return NextResponse.json({
        success: true,
        message: `Synchronisatie voltooid voor ${targetSource?.name || 'alle bronnen'}`,
        output: stdout,
        stderr: stderr || null,
      });
    } catch (execErr: any) {
      console.error('Scraper exec error:', execErr);
      return NextResponse.json({
        success: false,
        error: execErr.message || 'Fout tijdens uitvoeren van scraper',
        stderr: execErr.stderr || null,
        stdout: execErr.stdout || null,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
