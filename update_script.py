import os

projects = [
    ".",
    "omnimed-mobile",
    "omnimed-web",
    "omnimed_backend",
    "Setu-Drishti",
    "Setu-Drishti/SetuDrishtiApp",
    "Setu-Drishti/setu_drishti_backend",
    "Setu-Drishti/setu_drishti_web"
]

base_dir = "."

for p in projects:
    d = os.path.join(base_dir, p)
    if not os.path.isdir(d):
        continue
        
    # 1. Update README.md
    readme_path = os.path.join(d, "README.md")
    content = f"# {p} Module\n\nPart of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.\n\n### Private Repo Notice\nThis repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!\n\n"
    if os.path.exists(readme_path):
        old = open(readme_path, "r", encoding="utf-8").read()
        if "Private Repo Notice" not in old:
            open(readme_path, "w", encoding="utf-8").write(content + old)
    else:
        open(readme_path, "w", encoding="utf-8").write(content)
        
    # 2. Update .gitignore
    gi_path = os.path.join(d, ".gitignore")
    gi_content = ""
    if os.path.exists(gi_path):
        gi_content = open(gi_path, "r", encoding="utf-8").read()
    
    lines = gi_content.splitlines()
    new_lines = []
    for l in lines:
        if l.strip() in [".env", ".env.local", ".env.*", "package.json", "package-lock.json"]:
            continue
        new_lines.append(l)
        
    new_lines.append("\n# Explicitly Track Core Configs for Team")
    new_lines.append("!.env")
    new_lines.append("!.env.local")
    new_lines.append("!package.json")
    new_lines.append("!package-lock.json")
    new_lines.append("!requirements.txt")
    
    open(gi_path, "w", encoding="utf-8").write("\n".join(new_lines))
    
    # 3. Handle requirements.txt
    req_path = os.path.join(d, "requirements.txt")
    if "backend" in p and not os.path.exists(req_path):
        open(req_path, "w", encoding="utf-8").write("fastapi\nuvicorn\ntwilio\npydantic\nxgboost\npandas\nnumpy\nshap\ntorch\ntorchvision\nPillow\n")
    elif not os.path.exists(req_path) and p == ".":
        open(req_path, "w", encoding="utf-8").write("# Root requirements. See backend subfolders for full dependencies.\nfastapi\nuvicorn\n")
        
print('Done updating all READMEs, .gitignores, and requirements.txt')
