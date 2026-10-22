import os
import zipfile

def create_submission_zip():
    source_dir = os.path.dirname(os.path.abspath(__file__))
    target_dir = r"E:\FPTU\Term07\MMA301\QE190167"
    target_zip = os.path.join(target_dir, "QE190167.zip")
    local_zip = os.path.join(source_dir, "QE190167.zip")

    # Files / directories to strictly ignore
    ignored_dirs = {
        'node_modules',
        '.expo',
        '.git',
        '.vscode',
        'dist',
        'web-build',
        '__pycache__',
    }

    ignored_files = {
        '.env',  # DO NOT leak real Firebase API keys
        '.env.local',
        '.env.production',
        'QE190167.zip',
        'create_docx.py',
        'create_zip.py',
    }

    def should_include(rel_path):
        parts = rel_path.replace('\\', '/').split('/')
        for part in parts:
            if part in ignored_dirs:
                return False
            if part.startswith('~$'):  # Temp Office files
                return False
        filename = parts[-1]
        if filename in ignored_files:
            return False
        if filename.endswith('.pyc') or filename.endswith('.tsbuildinfo') or filename.endswith('.docx'):
            return False
        return True

    print(f"Creating submission zip: {target_zip}")
    files_to_add = []
    for root, dirs, files in os.walk(source_dir):
        # Filter directories in-place to prevent traversing ignored dirs
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, source_dir)
            if should_include(rel_path):
                files_to_add.append((full_path, rel_path.replace('\\', '/')))

    # Ensure target directory exists
    os.makedirs(target_dir, exist_ok=True)

    for zip_path in [target_zip, local_zip]:
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for full_path, arcname in files_to_add:
                zipf.write(full_path, arcname)

    print(f"Added {len(files_to_add)} files to zip.")
    print(f"Destination 1: {target_zip} ({os.path.getsize(target_zip):,} bytes)")
    print(f"Destination 2: {local_zip} ({os.path.getsize(local_zip):,} bytes)")

    # Verify root level files
    with zipfile.ZipFile(target_zip, 'r') as zipf:
        namelist = zipf.namelist()
        assert "package.json" in namelist, "package.json must be at root level!"
        assert ".env" not in namelist, ".env must NOT be in zip!"
        assert not any(n.startswith("node_modules/") for n in namelist), "node_modules must NOT be in zip!"
        print("Verification passed! package.json is at root, node_modules and .env are excluded.")

if __name__ == "__main__":
    create_submission_zip()
