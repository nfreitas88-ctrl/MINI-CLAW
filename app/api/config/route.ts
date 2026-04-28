import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const configPath = path.join(process.cwd(), 'mini-claw', 'config.json');
  
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8').trim();
      if (!data) return NextResponse.json({ provider: 'gemini' });
      
      try {
        return NextResponse.json(JSON.parse(data));
      } catch (parseError) {
        console.error('API Config Parse Error:', parseError);
        return NextResponse.json({ provider: 'gemini', error: 'Corrupted config file' });
      }
    }
    return NextResponse.json({ provider: 'gemini' });
  } catch (error) {
    console.error('API Config GET Error:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const configPath = path.join(process.cwd(), 'mini-claw', 'config.json');
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    const newConfig = await req.json();
    
    // Ler config atual
    let currentConfig: any = {};
    if (fs.existsSync(configPath)) {
      try {
        currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (e) {
        console.warn('Config file corrupted during POST, resetting...');
      }
    }
    
    const updatedConfig = { ...currentConfig, ...newConfig };
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    
    // Atualizar .env (simplificado)
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      const updateEnvVar = (name: string, value: string) => {
        const regex = new RegExp(`^${name}=.*`, 'm');
        if (envContent.match(regex)) {
          envContent = envContent.replace(regex, `${name}="${value}"`);
        } else {
          envContent += `\n${name}="${value}"`;
        }
      };

      if (updatedConfig.provider) updateEnvVar('LLM_PROVIDER', updatedConfig.provider);
      if (updatedConfig.ollamaModel) updateEnvVar('OLLAMA_MODEL', updatedConfig.ollamaModel);
      if (updatedConfig.geminiModel) updateEnvVar('GEMINI_MODEL', updatedConfig.geminiModel);
      
      fs.writeFileSync(envPath, envContent);
    }

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error) {
    console.error('API Config POST Error:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
