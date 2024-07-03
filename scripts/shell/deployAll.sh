#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SERVICES_DIR="$SCRIPT_DIR/../../services"

deploy_in_subdirs() {
  local dir=$1
  
    echo "Contents of $dir:"
    ls -l
  
  cd "$dir" || exit

  if [[ -f "cdk.json" ]]; then
    echo "Deploying service $dir"
    cdk deploy
  fi

  for subdir in * ; do
    if [[ -d "$subdir" ]]; then
      deploy_in_subdirs "$dir/$subdir"
    fi
  done

  cd - > /dev/null || exit
}

deploy_in_subdirs "$SERVICES_DIR"
