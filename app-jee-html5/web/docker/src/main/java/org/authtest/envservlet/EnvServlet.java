/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.authtest.envservlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A servlet that expands server side environment variables
 *
 * replace all ${env} file inside war file:
 *   http://localhost:8080/<war file path>/env?file=envtest.txt
 * get a server side variable:
 *   http://localhost:8080/<war file path>/env/JBOSS_HOME
 */
@SuppressWarnings("serial")
@WebServlet("/env/*")
public class EnvServlet extends HttpServlet {

    @Inject
    EnvService env;

    private void fileExpandEnv(String file, PrintWriter writer) throws IOException {
        ServletContext context = getServletContext();
        InputStream is = context.getResourceAsStream("/" + file);
        if (is != null) {
            try (InputStreamReader isr = new InputStreamReader(is,
                        StandardCharsets.UTF_8);
                 BufferedReader br = new BufferedReader(isr)) {
                br.lines().forEach(line -> writer.println(env.expandEnv(line)));
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter writer = resp.getWriter();
        resp.setContentType("text/plain;charset=UTF-8");

        if (req.getParameter("file") != null) {
            fileExpandEnv(req.getParameter("file"), writer);
        }
        else if (req.getPathInfo() != null) {
            writer.println(env.expandEnv("${" + req.getPathInfo().substring(1) + "}"));
        }
        writer.close();
    }
}
